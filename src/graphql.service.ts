import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLArgs, parse, execute, GraphQLString, GraphQLInt } from "graphql";
import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphQLService {
    async execute(query: string, schema: GraphQLSchema) 
    {
        try {
            const queryAST = parse(query);
          
            const result = await execute({
                schema,
                document: queryAST
            });

            return result;

        } catch(err) {


            return null;
        }

    }

    newSchema(_query: GraphQLObjectType): GraphQLSchema
    {
        return new GraphQLSchema({ query: _query  })
    }

    createType(name, fields, other?): GraphQLObjectType
    {
        return new GraphQLObjectType({
            fields: fields,
            name: name,
            ...other
        })
    }

    createUserType(): GraphQLObjectType
    {
        return new GraphQLObjectType({
            description: "Type specifically for user",
            name: "User",
            fields: {
                id: {
                    type: GraphQLInt,
                    resolve: () => { return 0; }
                },
                username: {
                    type: GraphQLString,
                    resolve: () => { return "myname"; }
                }
            }
        })
    }
}