"use client"
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useMutateAuth } from '../../hooks/useMutateAuth';

export const Logout = () => {
  const { logout } = useMutateAuth();

  return (
    <ArrowRightOnRectangleIcon
      onClick={logout}
      className="w-6 text-white cursor-pointer"
    />
  );
};