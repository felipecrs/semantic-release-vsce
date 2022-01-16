import verifyPkg from './verify-pkg';
import verifyAuth from './verify-auth';
import verifyOvsxAuth from './verify-ovsx-auth';

export default async logger => {
  await verifyPkg();

  await verifyAuth(logger);

  await verifyOvsxAuth(logger);
};
