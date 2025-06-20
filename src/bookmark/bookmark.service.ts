import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async findBookmark(bookmarkId: number) {
    console.log(bookmarkId);

    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId, // Use the unique identifier for the bookmark
        },
        select: {
          id: true,
          title: true,
          description: true,
          link: true,
          userID: true,
        },
      });

      if (!bookmark) {
        throw new ForbiddenException('Bookmark not found or access denied');
      }

      return bookmark;
    } catch (error) {
      throw error; // Consider logging the error for better debugging
    }
  }
}
