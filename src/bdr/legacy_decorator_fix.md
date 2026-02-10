
# Legacy Decorator Implementation needed
Since tsconfig has experimentalDecorators: true, we must use the legacy signature:
(target: any, propertyKey: string, descriptor: PropertyDescriptor)
