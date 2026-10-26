// =============================================================================
// CeylonGo — Module 07: Profile Header Component
// Architecture: Angular 21 Standalone + Signals + Memory-Only Avatar Preview
// Security Policy: Zero storage persistence. Immediate object URL revocation.
// =============================================================================

import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent implements OnDestroy {
  protected readonly profileService = inject(ProfileService);

  // Sourced from in-memory ProfileService
  protected readonly profile = this.profileService.profile;
  protected readonly userFullName = this.profileService.userFullName;
  protected readonly userInitials = this.profileService.userInitials;
  protected readonly userDistrictLabel = this.profileService.userDistrictLabel;

  // Local in-memory avatar object URL (revoked on destroy or replace)
  protected readonly activeObjectUrl = signal<string | null>(null);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly uploadSuccess = signal<string | null>(null);

  // Maximum image size: 2 MB
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024;
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Handle local image file selection from file dialog.
   * Validates format (JPG, PNG, WebP) and size (<= 2MB), then creates a memory-only Object URL.
   */
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Reset input so re-selecting same file triggers change
    input.value = '';

    if (!file) {
      return;
    }

    this.uploadError.set(null);
    this.uploadSuccess.set(null);

    // 1. Validate file format
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      this.uploadError.set('Invalid image format. Only JPG, PNG, and WebP images are supported.');
      return;
    }

    // 2. Validate file size (max 2 MB)
    if (file.size > this.MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      this.uploadError.set(`File size exceeds 2 MB limit (selected: ${sizeMb} MB). Please choose a smaller photo.`);
      return;
    }

    // 3. Clean up previous temporary object URL from memory
    this.revokeCurrentObjectUrl();

    // 4. Create new temporary browser-memory object URL
    const objectUrl = URL.createObjectURL(file);
    this.activeObjectUrl.set(objectUrl);
    this.uploadSuccess.set(`Preview updated: "${file.name}" (${(file.size / 1024).toFixed(0)} KB) — In-memory preview only.`);
  }

  /**
   * Remove the custom avatar preview and restore default initials.
   * Immediately revokes memory object URL.
   */
  protected removeAvatar(): void {
    this.revokeCurrentObjectUrl();
    this.uploadError.set(null);
    this.uploadSuccess.set('Custom avatar removed. Default initials restored.');
  }

  /**
   * Clear active notification message
   */
  protected dismissFeedback(): void {
    this.uploadError.set(null);
    this.uploadSuccess.set(null);
  }

  /**
   * Clean up any active object URL when component unmounts to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.revokeCurrentObjectUrl();
  }

  private revokeCurrentObjectUrl(): void {
    const current = this.activeObjectUrl();
    if (current) {
      URL.revokeObjectURL(current);
      this.activeObjectUrl.set(null);
    }
  }
}
