import { z } from "zod"
export const profilePicSchema = z.object({
    
    profilePic: z.string().url().optional(),
});