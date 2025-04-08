import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../../abilities/ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from 'src/users/decorators/check-policies.decorator';
import { IS_PUBLIC_KEY } from 'src/users/decorators/public.decorator';
import { from } from 'rxjs';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public routes are always accessible
    if (isPublic) {
      return true;
    }

    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    // No policy handlers means no special permission checks needed beyond authentication
    if (policyHandlers.length === 0) {
      return true; // Let the JwtAuthGuard handle authentication
    }

    const { user } = context.switchToHttp().getRequest();
    
    // If no user but policies required, deny access
    if (!user) {
      return false;
    }

    // Define abilities for this user
    const ability = this.abilityFactory.defineAbilitiesFor(user);

    // Check all policies - if any handler requires entity data
    const needsEntityCheck = policyHandlers.some(handler => handler.checkData);

    if (needsEntityCheck) {
      const request = context.switchToHttp().getRequest();
      const entityId = request.params.id;
      
      // If a policy requires entity checking but no ID is provided, pass for now
      // (The controller method will need to do the check)
      if (!entityId) {
        return policyHandlers
          .filter(handler => !handler.checkData)
          .every(handler => {
            return this.abilityFactory.can(
              ability,
              handler.action,
              handler.subject,
            );
          });
      }

      // Ideally, fetch the entity from its service, but this is controller-specific logic
      // You'll need to implement entity checking in your controller methods
    }

    // Check all policies
    return policyHandlers.every(handler => {
      if (handler.checkData) {
        return true; // We'll check this in the controller
      }
      return this.abilityFactory.can(
        ability,
        handler.action,
        handler.subject,
      );
    });
  }
}