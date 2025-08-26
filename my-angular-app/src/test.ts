import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  platformBrowserDynamicTesting(),
  undefined,
  { teardown: { destroyAfterEach: false } }
);