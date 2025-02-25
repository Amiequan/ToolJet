import React from 'react';
import { Code } from './Elements/Code';
import { QuerySelector } from './QuerySelector';
import { resolveReferences } from '@/_helpers/utils';

export function renderQuerySelector(component, dataQueries, eventOptionUpdated, eventName, eventMeta) {
  let definition = component.component.definition.events[eventName];
  definition = definition || {};

  return (
    <QuerySelector
      param={{ name: eventName }}
      definition={definition}
      eventMeta={eventMeta}
      dataQueries={dataQueries}
      eventOptionUpdated={eventOptionUpdated}
    />
  );
}
export function renderCustomStyles(
  component,
  componentMeta,
  paramUpdated,
  dataQueries,
  param,
  paramType,
  currentState,
  components = {},
  accordian,
  darkMode = false,
  verticalLine = true,
  placeholder = ''
) {
  const componentConfig = component.component;
  const componentDefinition = componentConfig.definition;
  const paramTypeDefinition = componentDefinition[paramType] || {};
  const definition = paramTypeDefinition[param] || {};
  const meta = componentMeta[paramType]?.[accordian]?.[param];

  if (
    componentConfig.component == 'DropDown' ||
    componentConfig.component == 'Form' ||
    componentConfig.component == 'Listview' ||
    componentConfig.component == 'TextInput' ||
    componentConfig.component == 'NumberInput' ||
    componentConfig.component == 'PasswordInput' ||
    componentConfig.component == 'Table'
  ) {
    const paramTypeConfig = componentMeta[paramType] || {};
    const paramConfig = paramTypeConfig[param] || {};
    const { conditionallyRender = null } = paramConfig;

    const getResolvedValue = (key) => {
      return paramTypeDefinition?.[key] && resolveReferences(paramTypeDefinition?.[key], currentState);
    };

    const utilFuncForMultipleChecks = (conditionallyRender) => {
      return conditionallyRender.reduce((acc, condition) => {
        const { key, value } = condition;
        if (paramTypeDefinition?.[key] ?? value) {
          const resolvedValue = getResolvedValue(key);
          acc.push(resolvedValue?.value !== value);
        }
        return acc;
      }, []);
    };

    if (conditionallyRender) {
      const isConditionallyRenderArray = Array.isArray(conditionallyRender);

      if (isConditionallyRenderArray && utilFuncForMultipleChecks(conditionallyRender).includes(true)) {
        return;
      } else {
        const { key, value } = conditionallyRender;
        if (paramTypeDefinition?.[key] ?? value) {
          const resolvedValue = getResolvedValue(key);
          if (resolvedValue?.value !== value) {
            return;
          }
        }
      }
    }
  }

  return (
    <>
      <Code
        param={{ name: param, ...component.component.properties[param] }}
        definition={definition}
        dataQueries={dataQueries}
        onChange={paramUpdated}
        paramType={paramType}
        components={components}
        componentMeta={componentMeta}
        darkMode={darkMode}
        componentName={component.component.name || null}
        type={meta?.type}
        fxActive={definition.fxActive ?? false}
        onFxPress={(active) => {
          paramUpdated({ name: param, ...component.component.properties[param] }, 'fxActive', active, paramType);
        }}
        component={component}
        verticalLine={verticalLine}
        accordian={accordian}
        placeholder={placeholder}
      />
    </>
  );
}

export function renderElement(
  component,
  componentMeta,
  paramUpdated,
  dataQueries,
  param,
  paramType,
  currentState,
  components = {},
  darkMode = false,
  placeholder = '',
  verticalLine = true
) {
  const componentConfig = component.component;
  const componentDefinition = componentConfig.definition;
  const paramTypeDefinition = componentDefinition[paramType] || {};
  const definition = paramTypeDefinition[param] || {};
  const meta = componentMeta[paramType][param];

  if (
    componentConfig.component == 'DropDown' ||
    componentConfig.component == 'Form' ||
    componentConfig.component == 'Listview'
  ) {
    const paramTypeConfig = componentMeta[paramType] || {};
    const paramConfig = paramTypeConfig[param] || {};
    const { conditionallyRender = null } = paramConfig;

    if (conditionallyRender) {
      const { key, value } = conditionallyRender;
      if (paramTypeDefinition?.[key] ?? value) {
        const resolvedValue = paramTypeDefinition?.[key] && resolveReferences(paramTypeDefinition?.[key], currentState);
        if (resolvedValue?.value !== value) return;
      }
    }
  }

  return (
    <Code
      param={{ name: param, ...component.component.properties[param] }}
      definition={definition}
      dataQueries={dataQueries}
      onChange={paramUpdated}
      paramType={paramType}
      components={components}
      componentMeta={componentMeta}
      darkMode={darkMode}
      componentName={component.component.name || null}
      type={meta?.type}
      fxActive={definition.fxActive ?? false}
      onFxPress={(active) => {
        paramUpdated({ name: param, ...component.component.properties[param] }, 'fxActive', active, paramType);
      }}
      component={component}
      verticalLine={verticalLine}
      placeholder={placeholder}
    />
  );
}
