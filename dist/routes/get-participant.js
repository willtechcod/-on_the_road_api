"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipant = getParticipant;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
async function getParticipant(app) {
    app.withTypeProvider().get('/participants/:participantId', {
        schema: {
            params: zod_1.z.object({
                participantId: zod_1.z.string().uuid(),
            }),
        },
    }, async (request) => {
        const { participantId } = request.params;
        const participant = await prisma_1.prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true,
            },
            where: { id: participantId },
        });
        if (!participant) {
            throw new client_error_1.ClientError('Partcipant not found');
        }
        return { participant };
    });
}
