import { apiClient } from './api-client';
import type { User } from './types';

export async function fetchMe(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
}