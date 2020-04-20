module.exports = {
    sayAnnivDateDS(month, day, isAnniv) {
        let datasource = {
            "bodyTemplate6Data": {
                "type": "object",
                "objectId": "bt6Sample",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg1.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg1.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "textContent": {
                    "primaryText": {
                        "type": "PlainText",
                        "text": "Your Anniversary is on:",
                        "aniv": `${month} ${day}`
                    }
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                "hintText": "Try, \"Alexa, tell me a Fun Fact\""
            }
        }
        if (isAnniv) {
            datasource = {
                "bodyTemplate6Data": {
                    "type": "object",
                    "objectId": "bt6Sample",
                    "backgroundImage": {
                        "contentDescription": null,
                        "smallSourceUrl": null,
                        "largeSourceUrl": null,
                        "sources": [
                            {
                                "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg2.png",
                                "size": "small",
                                "widthPixels": 0,
                                "heightPixels": 0
                            },
                            {
                                "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg2.png",
                                "size": "large",
                                "widthPixels": 0,
                                "heightPixels": 0
                            }
                        ]
                    },
                    "textContent": {
                        "primaryText": {
                            "type": "PlainText",
                            "text": "Your Anniversary is:",
                            "aniv": `Today! Congratulations!`
                        }
                    },
                    "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                    "hintText": "Try, \"Alexa, tell me a Fun Fact\""
                }
            }
        } 
        return datasource;
    },
    funFactDS(factIntro, fact) {
        let datasource = {
            "bodyTemplate1Data": {
                "type": "object",
                "objectId": "bt1Sample",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg5.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg5.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "title": `${factIntro}`,
                "textContent": {
                    "primaryText": {
                        "type": "PlainText",
                        "text": `${fact}`
                    }
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png"
            }
        }
        return datasource
    },
    showPicture() {
        let datasource = {
            "bodyTemplate7Data": {
                "type": "object",
                "objectId": "bt7Sample",
                "title": "Today's Daily Photo of Cheese",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/BT7_Background.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/BT7_Background.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "image": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/MollyforBT7.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/MollyforBT7.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                "hintText": "Try, \"Alexa, search for blue cheese\""
            }
        }
        return datasource
    }
}