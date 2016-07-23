import { IPoint } from '../utils/Interfaces';
import { Segment } from '../utils/Segment';
import { SceneBoundaries } from './SceneBoundaries';

interface IPathNodeOptions {
    point: IPoint,
    finalNode?: Boolean
}

class PathNode {

    connections: Array<PathNode>;

    constructor(private options: IPathNodeOptions) {
        this.connections = [];
    }

    get point(): IPoint {
        return this.options.point;
    }

    isFinal(): Boolean {
        return !!this.options.finalNode;
    }

}


class PathFinder {

    getPath(origin: IPoint, destination: IPoint, boundaries: SceneBoundaries): Array<IPoint> {
        var insideDestination = boundaries.getPositionInside(destination);

        if(boundaries.polygon.pointsCanSeeEachOther(origin, insideDestination)) {
            return [origin, insideDestination];
        }
        var concaveVertex = boundaries.polygon.getConcaveVertex();
        let graph = this.getGraphToSolve(origin, destination, concaveVertex, boundaries);

        return this.getSolutionToGraph(graph, destination);
    }

    private getGraphToSolve(origin: IPoint, destination: IPoint, otherVertex: Array<IPoint>, boundaries: SceneBoundaries): PathNode {
        let initialNode = new PathNode({
            point: origin
        });
        let finalNode = new PathNode({
            point: destination,
            finalNode: true
        });
        let allNodes = [initialNode, finalNode];
        otherVertex.forEach((vertex) => {
            allNodes.push(new PathNode({
                point: vertex
            }));
        })

        for(let i=0; i < allNodes.length; i++) {
            for(let j = i + 1; j < allNodes.length; j++) {
                if(boundaries.polygon.pointsCanSeeEachOther(allNodes[i].point, allNodes[j].point)) {
                    allNodes[i].connections.push(allNodes[j]);
                    allNodes[j].connections.push(allNodes[i]);
                }
            }
        }

        return initialNode;
    }

    private heuristicCost(point: IPoint, destination: IPoint): number {
        return (new Segment(point, destination)).length;
    }

    private realCost(point: IPoint, destination: IPoint): number {
        return (new Segment(point, destination)).length;
    }

    //https://en.wikipedia.org/wiki/A*_search_algorithm#Algorithm_description
    private getSolutionToGraph(firstNode: PathNode, destination: IPoint): Array<IPoint> {
        let closedSet: Set<PathNode> = new Set();
        let openSet: Set<PathNode> = new Set();
        openSet.add(firstNode);

        // For each node, which node it can most efficiently be reached from.
        // If a node can be reached from many nodes, cameFrom will eventually contain the
        // most efficient previous step.
        let cameFrom: Map<PathNode, PathNode> = new Map();

        // For each node, the cost of getting from the start node to that node.
        let gScore: Map<PathNode, number> = new Map; // default value of Infinity
        gScore.set(firstNode, 0); // The cost of going from start to start is zero.

        // For each node, the total cost of getting from the start node to the goal
        // by passing by that node. That value is partly known, partly heuristic.
        let fScore: Map<PathNode, number> = new Map; // default value of Infinity
        fScore.set(firstNode, this.heuristicCost(firstNode.point, destination));

        while(openSet.size > 0) {
            let current: PathNode = this.findLowestScore(fScore, openSet);
            if(current.isFinal()) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);
            closedSet.add(current);
            for(let i = 0; i < current.connections.length; i++) {
                let neighbor = current.connections[i];
                if(closedSet.has(neighbor)) {
                    continue;
                }
                let tentativeGScore = this.getGScore(gScore, current) + this.realCost(current.point, neighbor.point);
                if(!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                } else if(tentativeGScore >= this.getGScore(gScore, neighbor)) {
                    continue; // This is not a better path.
                }
                // This path is the best until now. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                let newFScore = this.getGScore(gScore, neighbor) + this.heuristicCost(neighbor.point, destination);
                fScore.set(neighbor, newFScore);
            }
        }

        throw 'ERROR, could not find a path';
    }

    private getGScore(gScore: Map<PathNode, number>, node: PathNode): number {
        if(gScore.has(node)) {
            return gScore.get(node);
        } else {
            return Infinity;
        }
    }

    private findLowestScore(scores: Map<PathNode, number>, openSet: Set<PathNode>) {
        let lowestScore: number, lowestNode: PathNode;
        let alreadyHasValue = false;
        scores.forEach((value, node) => {
            if(openSet.has(node)) {
                if(!alreadyHasValue || (value < lowestScore)) {
                    alreadyHasValue = true;
                    lowestScore = value;
                    lowestNode = node;
                }
            }
        });

        return lowestNode;
    }

    private reconstructPath(cameFrom: Map<PathNode, PathNode>, current: PathNode): Array<IPoint> {
        let totalPath = [current.point];

        while(cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath.push(current.point);
        }

        return totalPath.reverse();
    }

}

export const pathFinder = new PathFinder();
