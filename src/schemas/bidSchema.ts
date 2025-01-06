import { z } from 'zod'

export const bidSchema = z.object({
    bidAmount: z
        .number()
        .min(100, { message: 'Bid amount must be at least 1000 PKR characters.' })
});
