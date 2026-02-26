import { test } from '../src/fixtures';

test.describe('API BDR Demo', () => {

    test('User Authentication and Profile Check via API', async ({ userFlow }) => {
        // Mocking the API service layer for the demo
        // This ensures the test passes without a real backend while showing BDR reporting

        // @ts-ignore - accessing internal for demo mocking
        const api = userFlow.userApi;

        api.login = async () => ({
            ok: () => true,
            status: () => 200,
            json: async () => ({ success: true })
        } as any);

        api.getProfile = async () => ({
            ok: () => true,
            status: () => 200,
            json: async () => ({ name: 'Dmitry Sorvachev' })
        } as any);

        await userFlow.login('dmitry_sorvachev');
        await userFlow.verifyProfileIsAccessible();
    });
});
