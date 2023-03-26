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
            headers: json ? {'Content-Type': 'application/json'} : undefined,
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

    static get (url) {
        return this.request('GET', url);
    }
}


class BlockByNumberService {
    /**
     * @param {(string|number)[]} blockNumbers
     * @returns {Promise<Block[]>}
     */
    static async get(blockNumbers) {
        const {blocks} = await HTTPClient.post(`${backendBaseURL}/BlockByNumber`, blockNumbers);
        return blocks.map(block => ({
            blockNumber: block.block_number,
            timestamp: block.timestamp,
            clarified: block.clarified,
        }));
    }

    static async clarify(blockNumber) {
        return HTTPClient.put(`${backendBaseURL}/BlockByNumber/${blockNumber}`);
    }
}

async function resolveContactAddress (identifier) {
    return HTTPClient
        .get(`${backendBaseURL}/ResolveAddress/${identifier}`)
        .then(({contractAddress}) => contractAddress)
        .catch(() => null)
}

async function getTokenURI (contractAddress, tokenId) {
    return HTTPClient
        .get(`${backendBaseURL}/GetTokenURI/${contractAddress}/${tokenId}`)
        .then(({data}) => data)
        .catch(() => null)
}

async function hideAddress (contractAddress, transactionHash, signature) {
    await HTTPClient
        .post(`${backendBaseURL}/HideAddress/hide/${contractAddress}`, {
            transaction_hash: transactionHash,
            signature,
        })
        .then(({data}) => data)
        .catch(() => null)
    hiddenItemsService.loading();
}

async function unhideAddress (contractAddress, transactionHash, signature) {
    await HTTPClient
        .post(`${backendBaseURL}/HideAddress/unhide/${contractAddress}`, {
            transaction_hash: transactionHash,
            signature,
        })
        .then(({data}) => data)
        .catch(() => null)
    hiddenItemsService.loading();
}

async function getHiddenItems () {
    return HTTPClient
        .get(`${backendBaseURL}/HideAddress`)
        .then(({items}) => items)
        .catch(() => null)
}
