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

function dateTimePart (block) {
    const wrapper = block.clarified ? v => v : createWrapperForClarification(block);
    const timestamp = block.timestamp * 1000;
    return wrapper(new Date(timestamp).toLocaleString());
}

async function clarifyBlockNumber (previousBlock, element) {
    const newBlock = await BlockByNumberService.clarify(previousBlock.blockNumber);
    element.outerHTML = dateTimePart(newBlock);
}

function createWrapperForClarification (block) {
    const payload = JSON.stringify(block);
    return function notClarifiedWrapper(value) {
        return `<span
            data-toggle="tooltip"
            data-placement="top"
            title="Дата приблезительная, нажмите для уточнения"
            onclick='clarifyBlockNumber(${payload}, this)'
        >⚠️ ${value}</span>`;
    }
}
