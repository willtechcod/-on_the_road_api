"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrip = updateTrip;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const dayjs_1 = require("../lib/dayjs");
const client_error_1 = require("../errors/client-error");
async function updateTrip(app) {
    app.withTypeProvider().put('/trips/:tripId', {
        schema: {
            params: zod_1.z.object({
                tripId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                destination: zod_1.z.string().min(4),
                starts_at: zod_1.z.coerce.date(),
                ends_at: zod_1.z.coerce.date(),
            })
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { destination, starts_at, ends_at } = request.body;
        const trip = await prisma_1.prisma.trip.findUnique({
            where: { id: tripId }
        });
        if (!trip) {
            throw new client_error_1.ClientError('Trip not found');
        }
        if ((0, dayjs_1.dayjs)(starts_at).isBefore(new Date())) {
            throw new client_error_1.ClientError('Invalid trip start date!');
        }
        if ((0, dayjs_1.dayjs)(ends_at).isBefore(starts_at)) {
            throw new client_error_1.ClientError('Invalid trip end date!');
        }
        await prisma_1.prisma.trip.update({
            where: { id: tripId },
            data: {
                destination,
                starts_at,
                ends_at,
            },
        });
        return { tripId: trip.id };
    });
}
