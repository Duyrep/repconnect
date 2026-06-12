import Cookies from "js-cookie";

export let isRefreshing = false;
export const queue: (() => void)[] = [];

export default async function apiClient(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  try {
    if (isRefreshing) {
      return addToQueue(input, init);
    } else {
      const response = await fetch(input, { credentials: "include", ...init });

      if (response.status === 401) {
        const retryPromise = addToQueue(input, init);
        isRefreshing = true;
        refresh();
        return retryPromise;
      } else return response;
    }
  } catch (error) {
    throw error;
  }
}

async function refresh() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (response.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      console.log("delete access_token refresh_token");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error(error);
    return;
  } finally {
    isRefreshing = false;
    queue.forEach((e) => e());
    queue.length = 0;
  }
}

function addToQueue(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      try {
        const response = await fetch(input, {
          credentials: "include",
          ...init,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    };

    queue.push(execute);
  });
}
