import { Document, Field, Validate } from "payload/types";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";

const validate: Validate = async (value, { payload, user }) => {
  // Don't validate initial user creation and such.
  if (!user) return true;

  // Otherwise than in the above condition, tenant must have a value.
  if (!value) {
    return "Required";
  }

  // Skip the following validations on front-end.
  if (!payload) return true;

  // Check that the selected value is some tenant that user has access to.
  const authorizedTenants = await getAuthorizedTenants(
    payload,
    (user as Document).tenant.id
  );
  if (!authorizedTenants.includes(value)) return "Unauthorized";

  // All good :)
  return true;
};

/**
 * @returns Tenant field for users.
 */
export const createUserTenantField = (): Field => ({
  type: "relationship",
  name: "tenant",
  relationTo: "tenants",
  required: true,
  validate,
});
