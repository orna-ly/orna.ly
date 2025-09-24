import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ContactStatus } from '@prisma/client';
import {
  withValidation,
  withAdminAuth,
  withErrorHandling,
  withMethods,
  compose,
  type ApiContext,
} from '@/lib/api-middleware';
import {
  contactFiltersSchema,
  createContactSchema,
  type ContactFiltersInput,
  type CreateContactInput,
} from '@/lib/validations';
import {
  apiSuccess,
  handleDatabaseError,
  calculatePagination,
} from '@/lib/api-response';

// GET /api/contacts - Fetch contacts with filters (admin only)
const getContacts = compose(
  withErrorHandling,
  withMethods(['GET']),
  withAdminAuth,
  withValidation(contactFiltersSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const filters = context.validatedData as ContactFiltersInput;

  const where: { status?: ContactStatus } = {};

  // Apply status filter
  if (filters.status) {
    where.status = filters.status;
  }

  try {
    // Get total count for pagination
    const total = await prisma.contact.count({ where });

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;

    // Fetch contacts
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: filters.limit,
    });

    const pagination = calculatePagination(filters.page, filters.limit, total);

    return apiSuccess(
      contacts,
      'Contacts fetched successfully',
      200,
      pagination
    );
  } catch (error) {
    return handleDatabaseError(error);
  }
});

// POST /api/contacts - Create a new contact message
const createContact = compose(
  withErrorHandling,
  withMethods(['POST']),
  withValidation(createContactSchema)
)(async (request: NextRequest, context: ApiContext) => {
  const contactData = context.validatedData as CreateContactInput;

  try {
    // Check for potential spam (same email sending multiple messages in short time)
    const recentContacts = await prisma.contact.findMany({
      where: {
        email: contactData.email,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentContacts.length >= 3) {
      return apiSuccess(
        null,
        'Too many messages sent recently. Please wait before sending another message.',
        429
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        subject: contactData.subject,
        message: contactData.message,
        status: ContactStatus.NEW,
      },
    });

    return apiSuccess(contact, 'Contact message sent successfully', 201);
  } catch (error) {
    return handleDatabaseError(error);
  }
});

export async function GET(request: NextRequest) {
  return getContacts(request, {});
}

export async function POST(request: NextRequest) {
  return createContact(request, {});
}
