import React, {use, useEffect, useState} from 'react';
import {DownloadIcon} from '../components/download-icon';
import {LoadingIcon} from '../components/loading-icon';

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

function buildFileName(qualityName: string): string {
    // Get original title
    const originalTitleElement =
        document.getElementsByClassName('b-post__origtitle');
    const originalTitle =
        originalTitleElement.length > 0
            ? originalTitleElement[0].innerText
            : 'unknown';

    // Get current voice over name
    let currentVoiceOverName = 'unknown';
    const voiceOverElements =
        document.getElementsByClassName('b-translator__item');
    for (let i = 0; i < voiceOverElements.length; i++) {
        const element = voiceOverElements[i];
        if (element.className.endsWith('active')) {
            currentVoiceOverName = element.innerText;
            break;
        }
    }

    // Get selected season
    let selectedSeason = -1;
    const seasonsElements = document.getElementsByClassName(
        'b-simple_season__item',
    );
    for (let i = 0; i < seasonsElements.length; i++) {
        const element = seasonsElements[i];
        if (element.className.endsWith('active')) {
            selectedSeason = parseInt(element.getAttribute('data-tab_id')!);
            break;
        }
    }

    // Get selected episode
    let selectedEpisode = -1;
    const episodesElements = document.getElementsByClassName(
        'b-simple_episode__item',
    );
    for (let i = 0; i < episodesElements.length; i++) {
        const element = episodesElements[i];
        if (element.className.endsWith('active')) {
            selectedEpisode = parseInt(
                element.getAttribute('data-episode_id')!,
            );
            break;
        }
    }

    return `${originalTitle}-${qualityName}-s${selectedSeason}-ep${selectedEpisode}-${currentVoiceOverName}(RezkaPrime)`.replaceAll(
        ' ',
        '_',
    );
}

interface VideoSource {
    url: string;
    quality: string;
}

interface SubtitlesSource {
    url: string;
    language: string;
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

    async fetchVideoClosedCaptions(): Promise<SubtitlesSource[]> {
        if(!CDNPlayerInfo.subtitle) return [];

        const subtitlesLines = CDNPlayerInfo.subtitle.split(',');
        return subtitlesLines.map((line: string) => {
            const parts = line.split(']');
            const url = parts[1];
            const language = parts[0].replace('[', '');
            return {language: language, url: url};
        });
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
    const [closedCaptions, setClosedCaptions] = useState<SubtitlesSource[]>([]);

    const isSourcesLoaded = sources.length > 0;

    const fetchSources = async () => {
        const cdnPlayer = await new CDNPlayerWrapper();
        const sources = await cdnPlayer.fetchVideoSources();
        const closedCaptions = await cdnPlayer.fetchVideoClosedCaptions();
        setSources(sources);
        setClosedCaptions(closedCaptions);
    };

    const requestFileDownload = (url: string, fileName: string) => {
        window.postMessage(
            {
                type: 'DOWNLOAD_FILE',
                payload: {
                    url: url,
                    fileName: fileName,
                },
            },
            window.location.origin,
        );
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
                <div className="rezka-prime-toolbar-right-separate">
                    {sources.map(source => (
                        <div
                            onClick={() =>
                                void requestFileDownload(
                                    source.url,
                                    buildFileName(source.quality) + '.mp4',
                                )
                            }
                        >
                            <div className="rezka-button">
                                {source.quality}
                                <DownloadIcon className="rezka-button-icon" />
                            </div>
                        </div>
                    ))}

                    {closedCaptions.map(cc => (
                        <div
                            onClick={() =>
                                void requestFileDownload(
                                    cc.url,
                                    buildFileName(cc.language) + '.vtt',
                                )
                            }
                        >
                            <div className="rezka-button">
                                CC {cc.language}
                                <DownloadIcon className="rezka-button-icon" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
