import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

//Rotas relacionadas a viagens
app.register(createTrip);
app.register(confirmTrip);
app.register(updateTrip);
app.register(getTripDetails);

//Rotas relacionadas a participantes
app.register(getParticipants);
app.register(confirmParticipants);
app.register(getParticipant);

//Rotas relacionadas a atividades na viagem
app.register(createActivity);
app.register(getActivity);

//Rotas de convite para participar da viagem
app.register(createInvite);

//Rotas relacionadas a links na viagem
app.register(createLink);
app.register(getLinks);

app.listen({ port: env.PORT }).then(() =>{
  console.log('Server is running! ...🚀')
})