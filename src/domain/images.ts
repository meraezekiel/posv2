import { Directory, File, Paths } from 'expo-file-system';

const IMAGE_DIR = 'images';

/**
 * Copies a picked image out of the OS cache into the app's own storage.
 * Cache files are cleaned up by Android whenever it likes, so a saved product
 * photo has to live somewhere permanent or the thumbnail goes blank later.
 */
export function keepImage(sourceUri: string, name: string): string {
  const dir = new Directory(Paths.document, IMAGE_DIR);
  if (!dir.exists) dir.create({ intermediates: true });

  const extension = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
  const destination = new File(dir, `${name}.${extension}`);
  if (destination.exists) destination.delete();

  new File(sourceUri).copy(destination);
  return destination.uri;
}

/** Removes a stored image; a missing file is not an error. */
export function forgetImage(uri: string | undefined): void {
  if (!uri || !uri.startsWith('file://')) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // The image is going out of use either way.
  }
}
