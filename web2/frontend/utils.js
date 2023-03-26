function cached(routine) {
    let result;
    return async function () {
        if (!result) {
            result = await routine();
        }
        return result
    }
}

/**
 * @param {Block} block
 * @param {Object} options
 * @param {string} options.transactionHash
 */
function timestr(block, options) {
    const blockNumber = [
        `<a href="https://${network}.etherscan.io/tx/${options.transactionHash}" target="_blank">`,
        `${block.blockNumber}`,
        '</a>'
    ].join('');
    return `${dateTimePart(block)} (${blockNumber})`;
}

function dateTimePart(block) {
    const wrapper = block.clarified ? v => v : createWrapperForClarification(block);
    const timestamp = block.timestamp * 1000;
    return wrapper(new Date(timestamp).toLocaleString());
}

async function clarifyBlockNumber(previousBlock, element) {
    const newBlock = await BlockByNumberService.clarify(previousBlock.blockNumber);
    element.outerHTML = dateTimePart(newBlock);
}

function createWrapperForClarification(block) {
    const payload = JSON.stringify(block);
    return function notClarifiedWrapper(value) {
        return `<span
            data-toggle="tooltip"
            data-placement="top"
            title="Дата приблезительная, нажмите для уточнения"
            onclick='clarifyBlockNumber(${payload}, this)'
            style="cursor: pointer"
        >⚠️ ${value}</span>`;
    }
}

function mintNewAction(address) {
    return `<span
        data-toggle="tooltip"
        data-placement="top"
        title="Mint new\nfrom mainnet"
        style="cursor: pointer; font-size: 23px; color: #007700; line-height: 0;"
        onClick='${startMintNew.name}("${address}")'
    >⊕</span>`
}

async function parseLink(link) {
    const values = link.split('/').slice(-2);
    if (values.length !== 2 || !link.startsWith(linkStartsWith)) {
        throw new Error('Кажется, некорректная ссылка');
    }
    const [collection, tokenId] = values;
    if (!new RegExp('^\\d+$').test(tokenId)) {
        throw new Error('Кажется, некорректный token id');
    }
    let contactSourceAddress;
    if (ethers.utils.isAddress(collection)) {
        contactSourceAddress = collection;
    } else {
        contactSourceAddress = await resolveContactAddress(collection);
        if (!contactSourceAddress) {
            throw new Error('Не знаю такой коллекции ¯\\_(ツ)_/¯');
        }
    }
    return [contactSourceAddress, tokenId]
}

async function ensureCorrectNetwork(message) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const network = await provider.getNetwork();
    if (network.chainId !== 5) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x5'}],
            });
        } catch (err) {
            if (err.message === 'User rejected the request.') {
                alert(message);
            }
            throw err;
        }
    }
}

async function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);

    await ensureCorrectNetwork('так не пойдет. надо сменить сеть!!');

    return provider.getSigner();
}

async function startMintNew(address) {
    const link = prompt(`Введите ссылку на токен из маиннета (например, ${linkTokenExample})`);
    const [contactSourceAddress, tokenId] = await parseLink(link);
    const uri = await getTokenURI(contactSourceAddress, tokenId);
    if (!uri) {
        throw new Error('Не получается распарсить такое =(');
    }
    const contract = new ethers.Contract(
        address,
        ['function mintV2(string calldata uri)'],
        await getSigner()
    );
    await (await contract.mintV2(uri)).wait()
}

function hideActionText(isHidden) {
    if (isHidden) {
        return '🫣';
    } else {
        return '😳';
    }
}

async function hide(span, address, transactionHash) {
    const signer = await getSigner();
    const {from} = await signer.provider.getTransaction(transactionHash);
    if (from.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
        alert(`Необходимо законнектить кошелек: ${from}. т.к. он деплоил этот адрес`);
        span.style.display = 'none';
        return;
    }
    const ownedMode = hiddenItemsService.owner(address);
    const signature = await signer.signMessage(`${ownedMode ? 'Показывать всем' : 'Скрыть от всех'}: ${address}`);
    if (ownedMode) {
        await unhideAddress(address, transactionHash, signature);
    } else {
        await hideAddress(address, transactionHash, signature);
    }
    span.innerHTML = hideActionText(ownedMode);
    span.parentNode.parentNode.style.opacity = 0.5;
    document.getElementById(`action-hide-`);
}

function hideAction(address, transactionHash, isHidden) {
    return `<span
        id="action-hide-${address}"
        data-toggle="tooltip"
        data-placement="top"
        style="cursor: pointer; font-size: 1rem; color: #007700; line-height: 0;"
        onClick='${hide.name}(this, "${address}", "${transactionHash}")'
    >${hideActionText(!isHidden)}</span>`
}

function enumerate(arr, {start = 0}) {
    return arr.map((v, ind) => [v, start + ind]);
}
