import React, {useEffect, useState} from 'react';
import {DownloadIcon} from '../components/download-icon';
import {LoadingIcon} from '../components/loading-icon';

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

async function getFileSize(url: string): Promise<number> {
    return new Promise(async resolve => {
        const controller = new AbortController();
        fetch(url, {signal: controller.signal})
            .then(resp => {
                resolve(parseInt(resp.headers.get('Content-Length')!));
                controller.abort();
            })
            .catch(_ => {
                resolve(0);
            });
    });
}

interface VideoSource {
    url: string;
    quality: string;
}

class CDNPlayerWrapper {
    async fetchVideoSources(): Promise<VideoSource[]> {
        const sources: VideoSource[] = [];
        const arr = clearTrash(CDNPlayerInfo.streams).split(',');
        for (const e of arr) {
            const temp = e.split('[')[1].split(']');
            const quality = temp[0];
            const links = temp[1].split(' or ').filter(x => x.endsWith('.mp4'));
            for (const link of links) {
                const videoSource: VideoSource = {
                    url: link,
                    quality: quality,
                };
                sources.push(videoSource);
                break;
            }
        }
        return sources;
    }
}

interface DownloadingState {}
class IdleState implements DownloadingState {}
class ParsingState implements DownloadingState {}
class InProgressState implements DownloadingState {
    constructor(public progress: number) {}
}
class FinishedState implements DownloadingState {
    constructor(public file: Blob) {}
}

class VideoDownloader {
    private state: DownloadingState = IdleState;

    onStateChanged: (state: DownloadingState) => void = state => {};

    downloadFromSource(videoSource: VideoSource) {
        this.state = new ParsingState();
        this.onStateChanged(this.state);

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
        name = document.querySelector(
            '.b-content__main .b-post__title',
        )!.innerText;

        console.log(filename, season, episode, translation, name);

        const targetFileName = buildFileName(
            name,
            season,
            episode,
            translation,
            title,
        );

        this.state = new InProgressState(0);
        this.onStateChanged(this.state);

        xhr.open('GET', videoSource.url, true);
        xhr.responseType = 'blob';
        xhr.onprogress = prog => {
            const percentComplete = Math.round(
                (prog.loaded / prog.total) * 100,
            );
            console.log(`Downloading - ${percentComplete}%`);

            this.state = new InProgressState(percentComplete);
            this.onStateChanged(this.state);
        };
        xhr.onload = () => {
            const file = new Blob([xhr.response], {
                type: 'application/octet-stream',
            });
            this.state = new FinishedState(file);
            this.onStateChanged(this.state);
        };
        xhr.send();
    }
}

export function ControlPanel() {
    const [sources, setSources] = useState<VideoSource[]>([]);
    const [selectedSource, setSelectedSource] = useState<VideoSource | null>();
    const [videoDownloader, setVideoDownloader] = useState(
        new VideoDownloader(),
    );
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    const isSourcesLoaded = sources.length > 0;
    const isDownloading = downloadProgress > 0;

    const fetchSources = async () => {
        const sources = await new CDNPlayerWrapper().fetchVideoSources();
        setSources(sources);
        setSelectedSource(sources[0]); // Select first by default
    };

    const handleQualitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const qualityName = value.trim();
        console.log(value);
        const index = sources.findIndex(
            source => source.quality === qualityName,
        );
        console.log(index);
        setSelectedSource(sources[index]);
        console.log(sources[index]);
    };

    const handleDownload = async () => {
        if (!isSourcesLoaded) return;

        if (selectedSource) {
            videoDownloader.onStateChanged = state => {
                console.log(state);

                if (state instanceof InProgressState) {
                    const progress = state.progress;
                    setDownloadProgress(progress);
                } else if (state instanceof FinishedState) {
                    const file = state.file;
                    const downloadUrl = URL.createObjectURL(file);

                    const runtime =
                        typeof browser !== 'undefined'
                            ? browser.runtime
                            : chrome.runtime;

                    runtime.sendMessage(
                        {
                            type: 'DOWNLOAD_VIDEO',
                            payload: {
                                url: downloadUrl,
                                filename: 'video.mp4',
                            },
                        },
                        response => {
                            if (response?.status === 'success') {
                                console.log(
                                    'Download started by background script.',
                                );
                            } else {
                                console.error(
                                    'Background script failed to start download.',
                                );
                            }
                            // Once the message is sent and the Blob URL is used, we can revoke it.
                            // The background script will handle the download from its own context.
                            URL.revokeObjectURL(downloadUrl);
                            setDownloadProgress(0);
                        },
                    );
                }
            };
            videoDownloader.downloadFromSource(selectedSource);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

    return (
        <div className="rezka-prime-toolbar">
            <div className="rezka-prime-toolbar-left">
                <h3 className="">Rezka Prime</h3>
                <p>Downloading from CDN</p>
            </div>
            <div className="rezka-prime-toolbar-right">
                <span>
                    {isDownloading && (
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{width: `${downloadProgress}%`}}
                            >
                                {downloadProgress > 10
                                    ? `${downloadProgress}%`
                                    : ''}
                            </div>
                        </div>
                    )}
                </span>
                <select
    hidden={sources.length === 0}
    onChange={handleQualitySelect}
    className="rezka-select"
    value={selectedSource?.quality || ''}
>
    {sources.map(source => (
        <option
            key={source.quality}
            value={source.quality}
        >
            {source.quality}
        </option>
    ))}
</select>
                <div
                    hidden={sources.length === 0}
                    onClick={handleDownload}
                    className="rezka-button"
                >
                    {isSourcesLoaded ? (
                        <DownloadIcon />
                    ) : (
                        <LoadingIcon className="loading-icon" />
                    )}
                </div>
            </div>
        </div>
    );
}
