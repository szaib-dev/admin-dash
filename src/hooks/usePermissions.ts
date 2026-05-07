import { UserRole } from "../types";

interface UserData {
  fullname: string;
  email: string;
  id: string;
  role: 'ADMIN' | 'MANAGER'
}

const usePermission = () => {
  const _hasPermission = (user: UserData) => {
    if ([UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
      return true;
    }
    return false;
  };

  return {
    isAllowed: _hasPermission,
  };
};

export default usePermission;
