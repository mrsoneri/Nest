import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bookmarks')
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the bookmark to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'The bookmark has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Invalid bookmark ID' })
  @ApiResponse({
    status: 403,
    description: 'Bookmark not found or access denied',
  })
  getBookmark(@Param('id') bookmarkId: string) {
    const id = parseInt(bookmarkId, 10); // Convert to number
    if (isNaN(id)) {
      throw new BadRequestException('Invalid bookmark ID'); // Handle invalid ID format
    }
    return this.bookmarkService.findBookmark(id);
  }
}
