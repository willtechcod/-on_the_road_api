"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripDetails = getTripDetails;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function getTripDetails(app) {
    app.withTypeProvider().get('/trips/:tripId', {
        schema: {
            params: zod_1.z.object({
                tripId: zod_1.z.string().uuid(),
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
            select: {
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true,
            },
            where: { id: tripId },
        });
        if (!trip) {
            throw new client_error_1.ClientError('Trip not found');
        }
        return { trip };
    });
}
