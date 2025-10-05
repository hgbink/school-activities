import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '6c4'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '26f'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'f94'),
            routes: [
              {
                path: '/administration',
                component: ComponentCreator('/administration', 'b83'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/core-academic',
                component: ComponentCreator('/core-academic', '5a3'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/creative-arts',
                component: ComponentCreator('/creative-arts', '003'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/enrichment',
                component: ComponentCreator('/enrichment', '428'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/social-development',
                component: ComponentCreator('/social-development', '92d'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/sport-pe',
                component: ComponentCreator('/sport-pe', '869'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/wellbeing',
                component: ComponentCreator('/wellbeing', '3e6'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'c48'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
