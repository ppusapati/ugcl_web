import { component$, Slot } from "@builder.io/qwik";
import { hasPermissionRole } from "~/permission";
import { Role, User } from "~/types";

// Define the props interface
interface PermissionGuardProps {
    currentUser: User;
    resource: string;
    action: string;
    accessLevel: "view" | "edit" | "admin" | "create" | "delete";
    resourceId?: string; // Optional prop
    rolesAndPermissions: { [key: string]: Role };
    // children?: JSXChildren; // Children elements passed to the component
  }

  

export const PermissionGuard = component$((props: PermissionGuardProps) => {
  const { currentUser, resource, action, accessLevel, resourceId, rolesAndPermissions } = props;

  return hasPermissionRole(currentUser, resource, action, accessLevel, rolesAndPermissions, resourceId) ? (
    <Slot />
  ) : null;
});