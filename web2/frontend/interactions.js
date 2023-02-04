/**
 * @typedef {Object} Block
 * @property {Number} blockNumber
 * @property {Number} timestamp
 * @property {Boolean} clarified
 */

class HTTPClient {
    static async request(method, url, json) {
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: json ? JSON.stringify(json) : undefined
        });
        return response.json();
    }

    static post (url, json) {
        return this.request('POST', url, json);
    }

    static put (url) {
        return this.request('PUT', url);
    }
}


class BlockByNumberService {
    /**
     * @param {(string|number)[]} blockNumbers
     * @returns {Promise<Block[]>}
     */
    static async get(blockNumbers) {
        const {blocks} = await HTTPClient.post(backendBaseURL, blockNumbers);
        return blocks.map(block => ({
            blockNumber: block.block_number,
            timestamp: block.timestamp,
            clarified: block.clarified,
        }));
    }

    static async clarify(blockNumber) {
        return HTTPClient.put(`${backendBaseURL}/${blockNumber}`);
    }
}
