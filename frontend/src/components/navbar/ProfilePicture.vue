<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import * as gravatar from 'gravatar';
import {SessionStore} from '@/stores/SessionStore';

@Component({
  name: 'ProfilePicture',
})
export default class ProfilePicture extends Vue {
  @Prop({default: 64})
  readonly size!: number;

  private readonly sessionStore = new SessionStore();

  private useErrorProfilePictureUrl: boolean = false;

  get profilePictureUrl(): string | undefined {
    return (this.useErrorProfilePictureUrl ? this.errorProfilePictureUrl : undefined)
        ?? this.gravatarProfilePictureUrl
        ?? this.errorProfilePictureUrl;
  }

  private get gravatarProfilePictureUrl(): string | undefined {
    const email = this.sessionStore.user?.email;
    return email && gravatar.url(email, {protocol: 'https', s: '' + this.size});
  }

  private get errorProfilePictureUrl(): string {
    //prepare canvas
    let canvas = document.createElement('canvas');
    canvas.height = this.size;
    canvas.width = this.size;
    let context = canvas.getContext('2d')!;

    //prepare params
    const fontSize = this.size / 2;
    const char = (this.sessionStore.user?.displayName ?? '?').substring(0, 1);

    //prepare colors
    const r = (char.codePointAt(0)! * 1361) % 256;
    const g = (char.codePointAt(0)! * 1823) % 256;
    const b = (char.codePointAt(0)! * 2347) % 256;
    const brightness = r * r + g * g + b * b;
    const foregroundColor = brightness < 127 * 127 * 3 ? '#fff' : '#000';
    const backgroundColor = `rgb(${r},${g},${b})`;

    //background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, this.size, this.size);

    //text
    context.fillStyle = foregroundColor;
    context.font = `${fontSize}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(char, this.size / 2 + .5, this.size / 2 + .5);

    //fin
    return canvas.toDataURL('png');
  }

  async mounted(): Promise<void> {
    await this.sessionStore.loadIfAbsent();
  }

  onProfilePictureError(): void {
    this.useErrorProfilePictureUrl = true;
  }
}
</script>
<template>
  <img :src="profilePictureUrl" alt="Profile picture" :width="size" :height="size" class="rounded-circle"
       referrerpolicy="no-referrer" @error="onProfilePictureError">
</template>
