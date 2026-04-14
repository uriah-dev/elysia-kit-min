import { apiSuccess } from "@src/lib/common";
import type { PersonType } from "./schema";
import type { HomeContext } from ".";

export const sayHello = async ({ logger }: HomeContext) => {
  logger.info("Response success");

  return apiSuccess("Welcome here!");
};

export const sayHiPerson = ({
  body,
  logger,
}: HomeContext<{
  body: PersonType;
}>) => {
  logger.info("Person response success");
  return apiSuccess(body);
};
