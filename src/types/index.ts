import { Artist, Playlist, User } from '@prisma/client';

export interface ExtendedUser extends User {
  artist: Artist;
  followers: User[];
  following: User[];
  playlists: Playlist[];
}
