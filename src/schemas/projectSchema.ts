import { z } from 'zod'

export const projectSchema = z.object({
    title: z
        .string()
        .min(10, { message: 'Project title must be at least 10 characters.' }),
    details: z
        .string()
        .min(30, { message: 'Project description must be at least 30 characters.' }),
    amount: z
        .string()
        .min(4, { message: 'Project amount must be at least 3 digits.' })
        .max(6, { message: 'Project amount must not be more then 6 digits.' }),

});


