//
export function RMenu(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  // const menuIcon = `${rootURI}/content/icons/favicon.png`;
  function getMenuItem(menuPopup: string) {}

  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}
