"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipants = getParticipants;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function getParticipants(app) {
    app.withTypeProvider().get('/trips/:tripId/participants', {
        schema: {
            params: zod_1.z.object({
                tripId: zod_1.z.string().uuid(),
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        is_confirmed: true
                    }
                },
            },
        });
        if (!trip) {
            throw new client_error_1.ClientError('Trip not found');
        }
        return { participants: trip.participants };
    });
}
