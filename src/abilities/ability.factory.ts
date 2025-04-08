import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose'; // Importa Types de mongoose
import { UserRole } from 'src/users/dto/user.dto';

// Define possible actions
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Define rule format
export interface Rule {
  action: Action;
  subject: string;
  conditions?: any;
  fields?: string[];
  inverted?: boolean;
}

// Define abilities container
export interface Ability {
  rules: Rule[];
}

@Injectable()
export class AbilityFactory {
  defineAbilitiesFor(user: any): Ability { // Cambiamos User por any para evitar problemas de tipo
    const rules: Rule[] = [];

    // User abilities
    if (user?.role === UserRole.EDITOR) {
      // Obtenemos el ID de manera segura
      const userId = user._id || user.id;

      rules.push({
        action: Action.Read,
        subject: 'all',
      });

      rules.push({
        action: Action.Create,
        subject: 'Product',
      });

      // User can update their own products
      rules.push({
        action: Action.Update,
        subject: 'Product',
        conditions: { createdBy: userId },
      });

      // User can delete their own products
      rules.push({
        action: Action.Delete,
        subject: 'Product',
        conditions: { createdBy: userId },
      });
    }

    // Admin abilities
    if (user?.role === UserRole.ADMIN) {
      // Admin can manage all
      rules.push({
        action: Action.Manage,
        subject: 'all',
      });
    }
    return { rules };
  }

  can(ability: Ability, action: Action, subject: string, data?: any): boolean {
    // Si no hay reglas o habilidad definida, denegar acceso
    if (!ability || !ability.rules) {
      return false;
    }
    const manageRule = ability.rules.find(
      (rule) =>
        rule.action === Action.Manage &&
        (rule.subject === 'all' || rule.subject === subject),
    );
    
    if (manageRule) {
      return true;
    }

    // Check for specific action rules
    const rules = ability.rules.filter(
      (rule) =>
        (rule.action === action || rule.action === Action.Manage) &&
        (rule.subject === 'all' || rule.subject === subject),
    );

    // No rules = no permission
    if (rules.length === 0) {
      return false;
    }

    // Check conditions if they exist
    return rules.some((rule) => {
      if (!rule.conditions) {
        return true;
      }

      // Check all conditions
      return Object.entries(rule.conditions).every(([key, value]) => {
        // Si estamos comparando ObjectIds, necesitamos convertirlos a string
        if (data && data[key] && value) {
          // Si el valor es un ObjectId, conviértelo a string para comparar
          const dataValue = data[key] instanceof Types.ObjectId ? 
                            data[key].toString() : data[key];
          const condValue = value instanceof Types.ObjectId ?
                            value.toString() : value;
                            
          return dataValue === condValue;
        }
        return false;
      });
    });
  }
}