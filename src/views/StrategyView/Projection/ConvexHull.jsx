import {memo, useMemo} from "react";
import hull from "hull.js";
import LassoGroup from "./Group.js";

const W = 1000, H = 1000;

function sameArray(a1, a2) {
    return a1.length === a2.length && a1.every(v => a2.includes(v));
}

function useConvexHull(predictorGroup, points) {
    return useMemo(() => {
        const samplePoints = predictorGroup
            .map(i => [
                points[i][0] * W,
                points[i][1] * H,
                points[i][2] * W / 20
            ])
            .map(([x, y, r]) => {
                return new Array(360).fill(0)
                    .map((_, deg) => [
                        x + r * Math.cos(deg / 180 * Math.PI) * 1.5,
                        y + r * Math.sin(deg / 180 * Math.PI) * 1.5,
                    ])
            })
            .flat()
        const hullPoints = hull(samplePoints, 1000);
        return 'M' + hullPoints.map(p => p.join(' ')).join('L');
    }, [predictorGroup, points]);
}

function ConvexHull({predictorGroup, points, selected, onSelectGroup}) {
    const convexHull = useConvexHull(predictorGroup, points);
    return <LassoGroup d={convexHull}
                       width={W / 200}
                       selectable
                       selected={sameArray(selected, predictorGroup)}
                       onClick={() => onSelectGroup(predictorGroup)}/>
}

export default memo(ConvexHull);