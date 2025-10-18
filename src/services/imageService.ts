import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'invoice-logos';

/**
 * Upload une image vers Supabase Storage
 * @param file - Fichier image à uploader
 * @returns URL publique de l'image uploadée
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La taille de l\'image ne doit pas dépasser 5MB');
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Upload le fichier
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Supprime une image de Supabase Storage
 * @param imageUrl - URL de l'image à supprimer
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
    
    if (pathParts.length < 2) {
      console.warn('URL invalide, impossible d\'extraire le chemin');
      return;
    }

    const filePath = pathParts[1];

    // Supprimer le fichier
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Ne pas throw l'erreur pour ne pas bloquer la suppression de la facture
  }
};

/**
 * Vérifie si une URL est une image Supabase Storage
 * @param url - URL à vérifier
 * @returns true si c'est une image Supabase Storage
 */
export const isSupabaseStorageUrl = (url: string): boolean => {
  try {
    return url.includes('supabase.co/storage/v1/object/public/');
  } catch {
    return false;
  }
};

/**
 * Obtient l'URL publique d'une image depuis son chemin
 * @param filePath - Chemin du fichier dans le bucket
 * @returns URL publique
 */
export const getPublicUrl = (filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return publicUrl;
};
