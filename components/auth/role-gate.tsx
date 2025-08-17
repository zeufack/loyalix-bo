import { useCurrentRole } from '@/hooks/useCurrentRole';
import { UserRole } from '@/types/user';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const roles = useCurrentRole();

  if (!roles) {
    return null;
  }

  const hasAccess = roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};
