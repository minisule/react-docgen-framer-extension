/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type Documentation from '../Documentation';
import getPropertyName from './getPropertyName';
import { getDocblock } from './docblock';

export default (documentation: Documentation, propertyPath: NodePath) => {
  const propName = getPropertyName(propertyPath);
  if (!propName) return;

  const propDescriptor = documentation.getPropDescriptor(propName);
  if (propDescriptor.description) return;

  propDescriptor.description = getDocblock(propertyPath) || '';
  propDescriptor.framer = propDescriptor.description.includes('Appearance:')
    ? true
    : false;

  const fields = propDescriptor.description
    .split('\n')
    .filter(line => line.includes('@'));

  fields.forEach(field => {
    if (field.includes(' ')) {
      documentation.set(
        field.substring(1, field.indexOf(' ')),
        field.substring(field.indexOf(' ') + 1),
      );
    } else {
      documentation.set(field.substring(1), true);
    }
  });
};
