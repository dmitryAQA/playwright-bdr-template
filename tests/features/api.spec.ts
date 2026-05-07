import { test, BDR, attachTable, UserFactory, ProfileFactory, UserFlow, UserApiClient } from '../../src/fixtures';

/* eslint-disable no-restricted-syntax */
function createUserFlow(request: any) {
    return new UserFlow(new UserApiClient(request));
}
/* eslint-enable no-restricted-syntax */

test.describe('API BDR Demo', () => {
    test('User Authentication and Profile Check via API', async ({ request }) => {
        const userFlow = createUserFlow(request);
        const testUser = UserFactory.createFromSystem('DMITRY');
        const testProfile = ProfileFactory.createFromProfiles('DMITRY');

        await BDR.Given('Background: API service mocks configured for user auth', async () => {
            // @ts-ignore - access internal for mocking demonstration
            const api = userFlow.userApi;

            // Mocking the API layer using our data-driven factories
            api.login = async () =>
                ({
                    ok: () => true,
                    status: () => 200,
                    json: async () => ({ success: true }),
                }) as any;

            api.getProfile = async () =>
                ({
                    ok: () => true,
                    status: () => 200,
                    json: async () => testProfile,
                }) as any;

            await attachTable('Configured Mock Profile', [testProfile]);
        });

        await BDR.When('User logs in as {} via API', testUser.username, async () => {
            await userFlow.login(testUser);
        });

        await BDR.Then('User profile should be accessible and valid', async () => {
            await userFlow.verifyProfileIsAccessible();
        });
    });
});
