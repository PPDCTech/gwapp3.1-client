import { AuthGuard } from "../guards/auth-guard";

export const withAuthGuard = (Component) => {
  const WrappedComponent = (props) => (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
