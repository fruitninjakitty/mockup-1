
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an avatar image to Supabase storage
 * @param userId The user ID to associate with the avatar
 * @param avatarFile The file to upload
 * @returns The public URL of the uploaded file, or null if upload failed
 */
export const uploadAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
  if (!avatarFile) return null;
  
  try {
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
};
