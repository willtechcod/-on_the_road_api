"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmParticipants = confirmParticipants;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
const env_1 = require("../env");
async function confirmParticipants(app) {
    app.withTypeProvider().get('/participants/:participantId/confirm', {
        schema: {
            params: zod_1.z.object({
                participantId: zod_1.z.string().uuid(),
            })
        },
    }, async (request, reply) => {
        const { participantId } = request.params;
        const participant = await prisma_1.prisma.participant.findUnique({
            where: {
                id: participantId,
            }
        });
        if (!participant) {
            throw new client_error_1.ClientError('Participant not found.');
        }
        if (participant.is_confirmed) {
            return reply.redirect(`${env_1.env.WEB_BASE_URL}/trips/${participant.trip_id}`);
        }
        await prisma_1.prisma.participant.update({
            where: { id: participantId },
            data: { is_confirmed: true }
        });
        return reply.redirect(`${env_1.env.WEB_BASE_URL}/trips/${participant.trip_id}`);
    });
}
