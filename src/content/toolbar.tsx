import React, {useState} from 'react';
import {DownloadIcon} from '../components/download-icon';

function buildFileName(
    name: string,
    season: string,
    episode: string,
    translation: string,
    res: string,
) {
    return `${name}-${season}-${episode}-${translation}-${res}`;
}

function clearTrash(data) {
    function product(iterables, repeat) {
        let argv = Array.prototype.slice.call(arguments),
            argc = argv.length;
        if (argc === 2 && !isNaN(argv[argc - 1])) {
            const copies = [];
            for (let i = 0; i < argv[argc - 1]; i++) {
                copies.push(argv[0].slice());
            }
            argv = copies;
        }
        return argv.reduce(
            (accumulator, value) => {
                const tmp = [];
                accumulator.forEach(a0 => {
                    value.forEach(a1 => {
                        tmp.push(a0.concat(a1));
                    });
                });
                return tmp;
            },
            [[]],
        );
    }
    function unite(arr) {
        const final = [];
        arr.forEach(e => {
            final.push(e.join(''));
        });
        return final;
    }
    const trashList = ['@', '#', '!', '^', '$'];
    const two = unite(product(trashList, 2));
    const tree = unite(product(trashList, 3));
    const trashCodesSet = two.concat(tree);

    const arr = data.replace('#h', '').split('//_//');
    let trashString = arr.join('');

    trashCodesSet.forEach(i => {
        const temp = btoa(i);
        trashString = trashString.replaceAll(temp, '');
    });

    const final_string = atob(trashString);
    return final_string;
}

async function getFileSize(url: string) {
    return new Promise(async resolve => {
        const controller = new AbortController();
        fetch(url, {signal: controller.signal})
            .then(resp => {
                resolve(resp.headers.get('Content-Length'));
                controller.abort();
            })
            .catch(_ => {
                resolve(0);
            });
    });
}

class CDNPlayerWrapper {
    async getCDNPlayerInfo() {
        return CDNPlayerInfo;
    }

    get streams() {
        return CDNPlayerInfo.streams;
    }
}

async function downloadBtnClicked() {
    const cdnPlayer = new CDNPlayerWrapper();
    const arr = clearTrash(cdnPlayer.streams).split(',');
    for (const e of arr) {
        const temp = e.split('[')[1].split(']');
        const quality = temp[0];
        const links = temp[1].split(' or ').filter(x => x.endsWith('.mp4'));
        for (const link of links) {
            const size = await getFileSize(link);
            if (size) {
                // size = formatBytes(size, 1);
                // let element = makeLink(quality, link, size);
                console.log(link);
                break;
            } else {
                console.error({_: 'Error', name: quality, url: link});
            }
        }
    }

    const xhr = new XMLHttpRequest();

    const player = document.getElementById('player');
    const href = player?.getElementsByTagName('video')[0].src;
    const filename = href!.split('/').pop();

    const title = 'handleDownload';
    let season, episode, translation, name;

    const el = document.querySelector('#simple-episodes-tabs .active');
    if (el) {
        season = el.getAttribute('data-season_id');
        episode = el.getAttribute('data-episode_id');
    }
    const el2 = document.querySelector('#translators-list .active');
    if (el2) {
        translation = el2.innerText;
    }
    name = document.querySelector('.b-content__main .b-post__title')!.innerText;

    console.log(filename, season, episode, translation, name);

    const targetFileName = buildFileName(
        name,
        season,
        episode,
        translation,
        title,
    );

    xhr.open('GET', href!, true);
    xhr.responseType = 'blob';
    xhr.onprogress = prog => {
        const percentComplete = Math.round((prog.loaded / prog.total) * 100);
        console.log(`Downloading - ${percentComplete}%`);
    };
    xhr.onload = function () {
        const file = new Blob([xhr.response], {
            type: 'application/octet-stream',
        });
        const a_el = document.createElement('a');
        a_el.href = window.URL.createObjectURL(file);
        const extension = filename!.split('.').pop();
        a_el.download = `${targetFileName}.${extension}`;
        a_el.click();
        setTimeout(() => {}, 1000);
    };
    xhr.send();
}

export function ControlPanel() {
    const handleDownload = async () => {
        downloadBtnClicked();
    };

    return (
        <div className="rezka-prime-toolbar">
            <h3 className="">Rezka Prime</h3>
            <select className="rezka-select">
                <option>480p</option>
                <option>720p</option>
                <option>1080p</option>
            </select>
            <div onClick={handleDownload} className="rezka-button">
                <DownloadIcon />
            </div>
        </div>
    );
}
