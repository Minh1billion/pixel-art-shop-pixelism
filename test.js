import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

const BASE_URL = "https://pixelism.duckdns.org/api/v1";

export const options = {
    scenarios: {
        // Scenario 1: Spike test — đột ngột tăng tải
        spike: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "10s", target: 50 },
                { duration: "20s", target: 50 },
                { duration: "5s",  target: 0  },
            ],
            gracefulRampDown: "5s",
        },
    },
    thresholds: {
        http_req_duration: ["p(95)<500"],   // 95% request < 500ms
        http_req_failed:   ["rate<0.01"],   // error rate < 1%
        errors:            ["rate<0.01"],
    },
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const SORT_OPTIONS = ["createdAt", "name"];
const SORT_ORDERS  = ["asc", "desc"];
const KEYWORDS     = ["slime", "sword", "fire", "dark", "pixel", "hero", ""];
const PAGES        = [0, 1, 2];
const SIZES        = [12, 24, 42];

// ----------------------------------------------------------------
// Scenarios
// ----------------------------------------------------------------

function testGetAllSprites() {
    const keyword   = randomItem(KEYWORDS);
    const sortBy    = randomItem(SORT_OPTIONS);
    const sortOrder = randomItem(SORT_ORDERS);
    const page      = randomItem(PAGES);
    const size      = randomItem(SIZES);

    const url = `${BASE_URL}/sprites?keyword=${keyword}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&size=${size}`;
    const res = http.get(url);

    check(res, {
        "sprites list: status 200":        (r) => r.status === 200,
        "sprites list: has content":       (r) => {
            try {
                const body = JSON.parse(r.body);
                return Array.isArray(body.data?.content);
            } catch { return false; }
        },
        "sprites list: response time < 1s": (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
}

function testGetAllAssetPacks() {
    const keyword   = randomItem(KEYWORDS);
    const sortBy    = randomItem(["createdAt", "price"]);
    const sortOrder = randomItem(SORT_ORDERS);
    const page      = randomItem(PAGES);
    const size      = randomItem(SIZES);

    const url = `${BASE_URL}/asset-packs?keyword=${keyword}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&size=${size}`;
    const res = http.get(url);

    check(res, {
        "asset-packs list: status 200":         (r) => r.status === 200,
        "asset-packs list: has content":        (r) => {
            try {
                const body = JSON.parse(r.body);
                return Array.isArray(body.data?.content);
            } catch { return false; }
        },
        "asset-packs list: response time < 1s": (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);
}

function testGetCategories() {
    const res = http.get(`${BASE_URL}/categories`);

    check(res, {
        "categories: status 200":         (r) => r.status === 200,
        "categories: response time < 500ms": (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
}

function testGetSpritesWithFilter() {
    // Simulate user filtering by category
    const url = `${BASE_URL}/sprites?sortBy=createdAt&sortOrder=desc&page=0&size=12`;
    const res = http.get(url);

    check(res, {
        "sprites filtered: status 200": (r) => r.status === 200,
    }) || errorRate.add(1);
}

function testGetAssetPacksWithPriceFilter() {
    const url = `${BASE_URL}/asset-packs?minPrice=0&maxPrice=100&sortBy=price&sortOrder=asc&page=0&size=12`;
    const res = http.get(url);

    check(res, {
        "asset-packs price filter: status 200": (r) => r.status === 200,
    }) || errorRate.add(1);
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------

export default function () {
    const rand = Math.random();

    if (rand < 0.40) {
        // 40% — browse sprites (most common)
        testGetAllSprites();
    } else if (rand < 0.60) {
        // 20% — browse asset packs
        testGetAllAssetPacks();
    } else if (rand < 0.75) {
        // 15% — get categories (sidebar)
        testGetCategories();
    } else if (rand < 0.88) {
        // 13% — sprites with filter
        testGetSpritesWithFilter();
    } else {
        // 12% — asset packs with price filter
        testGetAssetPacksWithPriceFilter();
    }

    sleep(Math.random() * 0.5); // think time 0–0.5s
}