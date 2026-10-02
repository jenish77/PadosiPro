import { prisma } from '../../config/db';

export interface SaveProfileInput {
  name: string;
  mobileNumber: string;
  address: string;
  societyBuilding?: string;
  flatUnit?: string;
  businessName?: string;
}

export class ProfileService {
  static async saveProfile(userId: string, input: SaveProfileInput) {
    const cleanedMobile = input.mobileNumber.replace(/[\s\-]/g, '');
    const indianMobileRegex = /^(\+91)?[6-9]\d{9}$/;

    if (!indianMobileRegex.test(cleanedMobile)) {
      throw {
        statusCode: 400,
        message: 'Invalid Indian mobile number. Please enter a valid 10-digit mobile number.',
      };
    }

    const formattedMobile = cleanedMobile.startsWith('+91')
      ? cleanedMobile
      : `+91${cleanedMobile}`;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        name: input.name.trim(),
        mobileNumber: formattedMobile,
        address: input.address.trim(),
        societyBuilding: input.societyBuilding?.trim() || null,
        flatUnit: input.flatUnit?.trim() || null,
        businessName: input.businessName?.trim() || null,
      },
      create: {
        userId,
        name: input.name.trim(),
        mobileNumber: formattedMobile,
        address: input.address.trim(),
        societyBuilding: input.societyBuilding?.trim() || null,
        flatUnit: input.flatUnit?.trim() || null,
        businessName: input.businessName?.trim() || null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { hasCompletedProfile: true },
    });

    return profile;
  }

  static async getProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw { statusCode: 404, message: 'Profile not found' };
    }

    return profile;
  }
}
