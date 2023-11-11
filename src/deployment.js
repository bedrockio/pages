const config = require('@bedrockio/config');
const k8s = require('@kubernetes/client-node');

// Initialize the Kubernetes API client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const client = kc.makeApiClient(k8s.AppsV1Api);

const LANDING_DEPLOYMENT = config.get('LANDING_DEPLOYMENT');

async function publishDeployment() {
  if (!config.has('KUBERNETES_SERVICE_HOST')) {
    return;
  }
  // Note that this operation requires the default service account to
  // have the ability to patch deployments. This can be added by applying:
  // deployment/environments/<ENVIRONMENT>/services/deployer-role.yml
  try {
    await client.patchNamespacedDeployment(
      // Deployment Name
      LANDING_DEPLOYMENT,
      // Namespace
      'default',
      // Spec update
      {
        spec: {
          template: {
            metadata: {
              labels: {
                // Modifying the label will trigger the update
                // Labels must be alphanumeric only
                published: new Date().getTime().toString(),
              },
            },
          },
        },
      },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      // https://github.com/kubernetes-client/javascript/issues/19
      {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    );
  } catch (error) {
    throw new Error(error.body.message);
  }
}

module.exports = {
  publishDeployment,
};
