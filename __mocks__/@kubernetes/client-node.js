let patch;

class KubeConfig {
  loadFromDefault() {
    return;
  }

  makeApiClient() {
    return new MockClient();
  }
}

class MockClient {
  patchNamespacedDeployment(...args) {
    const [deployment, namespace, update] = args;
    patch = {
      deployment,
      namespace,
      update,
    };
  }
}

function assertPatched(deployment) {
  expect(patch.deployment).toBe(deployment);
}

function assertNotPatched() {
  expect(patch).toBeUndefined();
}

afterEach(() => {
  patch = undefined;
});

module.exports = {
  KubeConfig,
  assertPatched,
  assertNotPatched,
};
